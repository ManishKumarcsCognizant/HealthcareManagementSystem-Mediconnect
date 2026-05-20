package com.application.repository;

import org.springframework.data.repository.CrudRepository;
import java.util.List;

import com.application.model.Slots;

public interface SlotBookingRepository extends CrudRepository<Slots,Integer>
{
	public List<Slots> findByEmail(String email);
}
